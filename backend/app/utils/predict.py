import logging
import os
import joblib
import numpy as np
from typing import Dict, List, Optional
from ..schemas import VitalScanInput, RiskOutput

logger = logging.getLogger(__name__)

# ─────────────────────────────
# SECTION A: Model Loading
# ─────────────────────────────

def load_models():
    """Load ML models from pickle files. Returns models or None if missing."""
    models = {
        "heart": None,
        "diabetes": None
    }
    
    models_dir = os.path.join(os.path.dirname(__file__), "..", "..", "models")
    
    # Load heart disease model
    heart_model_path = os.path.join(models_dir, "heart_model.pkl")
    try:
        models["heart"] = joblib.load(heart_model_path)
        logger.info("Heart model loaded successfully")
    except FileNotFoundError:
        logger.warning(f"Heart model not found at {heart_model_path}. Using fallback prediction.")
    except Exception as e:
        logger.warning(f"Failed to load heart model: {e}. Using fallback prediction.")
    
    # Load diabetes model
    diabetes_model_path = os.path.join(models_dir, "diabetes_model.pkl")
    try:
        models["diabetes"] = joblib.load(diabetes_model_path)
        logger.info("Diabetes model loaded successfully")
    except FileNotFoundError:
        logger.warning(f"Diabetes model not found at {diabetes_model_path}. Using fallback prediction.")
    except Exception as e:
        logger.warning(f"Failed to load diabetes model: {e}. Using fallback prediction.")
    
    return models

# Load models globally
MODELS = load_models()


# ─────────────────────────────
# SECTION B: Feature Engineering
# ─────────────────────────────

def prepare_heart_features(data: VitalScanInput) -> np.ndarray:
    """
    Prepare features for heart disease model.
    Maps categorical inputs to numeric values.
    
    Feature order: age, sex, height, weight, bmi, waist, family_heart,
                   family_diabetes, smoking, activity, sleep, stress,
                   fried_food, chest_discomfort, salt
    """
    # Map categorical variables to numeric
    sex_map = {"Male": 1, "Female": 0}
    smoking_map = {"Never": 0, "Former": 1, "Current": 2}
    activity_map = {"Sedentary": 3, "Light": 2, "Moderate": 1, "Active": 0}
    sleep_map = {"<5": 3, "5-6": 2, "7-8": 0, ">8": 1}
    stress_map = {"Low": 0, "Moderate": 1, "High": 2}
    fried_map = {"Rarely": 0, "Sometimes": 1, "Frequently": 2}
    discomfort_map = {"Never": 0, "Occasionally": 1, "Frequently": 2}
    salt_map = {"Low": 0, "Moderate": 1, "High": 2}
    
    # Calculate BMI
    bmi = data.weight_kg / ((data.height_cm / 100) ** 2)
    
    # Create feature vector
    features = np.array([
        data.age,
        sex_map[data.sex],
        data.height_cm,
        data.weight_kg,
        bmi,
        data.waist_cm,
        1 if data.family_history_heart else 0,
        1 if data.family_history_diabetes else 0,
        smoking_map[data.smoking_status],
        activity_map[data.physical_activity],
        sleep_map[data.sleep_hours],
        stress_map[data.stress_level],
        fried_map[data.fried_food],
        discomfort_map[data.chest_discomfort],
        salt_map[data.salt_intake]
    ]).reshape(1, -1)
    
    return features


def prepare_diabetes_features(data: VitalScanInput) -> np.ndarray:
    """
    Prepare features for diabetes model.
    Maps categorical inputs to numeric values.
    
    Feature order: age, sex, height, weight, bmi, waist, family_diabetes,
                   family_heart, smoking, activity, sleep, stress,
                   sugar_intake, thirst_fatigue, water_intake
    """
    sex_map = {"Male": 1, "Female": 0}
    smoking_map = {"Never": 0, "Former": 1, "Current": 2}
    activity_map = {"Sedentary": 3, "Light": 2, "Moderate": 1, "Active": 0}
    sleep_map = {"<5": 3, "5-6": 2, "7-8": 0, ">8": 1}
    stress_map = {"Low": 0, "Moderate": 1, "High": 2}
    sugar_map = {"Low": 0, "Moderate": 1, "High": 2}
    thirst_map = {"Never": 0, "Sometimes": 1, "Often": 2}
    water_map = {"<1L": 0, "1-2L": 1, ">2L": 2}
    
    # Calculate BMI
    bmi = data.weight_kg / ((data.height_cm / 100) ** 2)
    
    # Create feature vector
    features = np.array([
        data.age,
        sex_map[data.sex],
        data.height_cm,
        data.weight_kg,
        bmi,
        data.waist_cm,
        1 if data.family_history_diabetes else 0,
        1 if data.family_history_heart else 0,
        smoking_map[data.smoking_status],
        activity_map[data.physical_activity],
        sleep_map[data.sleep_hours],
        stress_map[data.stress_level],
        sugar_map[data.sugar_intake],
        thirst_map[data.thirst_fatigue],
        water_map[data.water_intake]
    ]).reshape(1, -1)
    
    return features


# ─────────────────────────────
# SECTION C: Obesity Scoring (Pure Logic, No ML)
# ─────────────────────────────

def calculate_obesity_risk(data: VitalScanInput) -> Dict:
    """
    Calculate obesity risk score using BMI, WHtR, and lifestyle factors.
    No ML model — pure logic.
    
    Returns:
        {score: 0-100, category: WHO category, bmi: calculated BMI, whtr: waist-to-height ratio}
    """
    # Calculate BMI and WHtR
    bmi = data.weight_kg / ((data.height_cm / 100) ** 2)
    whtr = data.waist_cm / data.height_cm
    
    # Base score from BMI
    if bmi < 18.5:
        bmi_score = 5  # Underweight
        category = "Underweight"
    elif bmi < 25:
        bmi_score = 10  # Normal weight
        category = "Normal weight"
    elif bmi < 30:
        bmi_score = 45  # Overweight
        category = "Overweight"
    elif bmi < 35:
        bmi_score = 65  # Obese Class I
        category = "Obese Class I"
    elif bmi < 40:
        bmi_score = 80  # Obese Class II
        category = "Obese Class II"
    else:
        bmi_score = 95  # Obese Class III (severe)
        category = "Obese Class III"
    
    # WHtR adjustment (central obesity increases risk)
    whtr_penalty = 0
    if whtr > 0.6:
        whtr_penalty = 10
    elif whtr > 0.5:
        whtr_penalty = 5
    
    score = bmi_score + whtr_penalty
    
    # Physical activity penalty
    activity_map = {"Sedentary": 8, "Light": 4, "Moderate": 0, "Active": 0}
    score += activity_map.get(data.physical_activity, 0)
    
    # Sleep penalty (poor sleep increases obesity risk)
    sleep_map = {"<5": 6, "5-6": 3, "7-8": 0, ">8": 1}
    score += sleep_map.get(data.sleep_hours, 0)
    
    # Diet penalty
    if data.sugar_intake == "High":
        score += 5
    if data.fried_food == "Frequently":
        score += 5
    
    # Water intake bonus (negative penalty)
    if data.water_intake == ">2L":
        score = max(0, score - 2)
    
    # Clamp score to 0-100
    score = max(0, min(100, score))
    
    return {
        "score": score,
        "category": category,
        "bmi": round(bmi, 1),
        "whtr": round(whtr, 3)
    }


# ─────────────────────────────
# SECTION D: Compounding Risk Logic
# ─────────────────────────────

def calculate_compounding(
    heart_score: float,
    diabetes_score: float,
    obesity_score: float
) -> Dict:
    """
    Apply compounding risk adjustments when multiple risk factors are high.
    
    Returns:
        {heart_score, diabetes_score, obesity_score, compounding_alert, compounding_message}
    """
    adjusted_heart = heart_score
    compounding_alert = False
    compounding_message = ""
    
    # Compounding risk: obesity + diabetes → increased heart risk
    if diabetes_score > 55 and obesity_score > 55:
        adjusted_heart = min(100, adjusted_heart + 10)
        compounding_alert = True
        compounding_message = "Multiple risk factors detected: Your obesity and diabetes risk are both elevated, significantly increasing heart disease risk."
    
    # Compounding risk: heart + diabetes
    if heart_score > 60 and diabetes_score > 50:
        compounding_alert = True
        if not compounding_message:
            compounding_message = "Multiple risk factors detected: Heart disease and diabetes risk are both elevated. Urgent lifestyle changes recommended."
    
    # Compounding risk: obesity + diabetes
    if obesity_score > 60 and diabetes_score > 55:
        compounding_alert = True
        if not compounding_message:
            compounding_message = "Multiple risk factors detected: Obesity and diabetes risk are both high. Immediate action required."
    
    return {
        "heart_score": adjusted_heart,
        "diabetes_score": diabetes_score,
        "obesity_score": obesity_score,
        "compounding_alert": compounding_alert,
        "compounding_message": compounding_message
    }


# ─────────────────────────────
# SECTION E: Action Plan Generator
# ─────────────────────────────

def generate_action_plan(
    data: VitalScanInput,
    heart_score: float,
    diabetes_score: float,
    obesity_score: float
) -> List[str]:
    """
    Generate personalized action plan based on user inputs and risk scores.
    Returns 3 most impactful actions specific to user's profile.
    """
    actions = []
    
    # Smoking is highest priority if applicable
    if data.smoking_status == "Current":
        actions.append("🚭 QUIT SMOKING — This is your single highest-impact change. Smoking increases heart disease risk by 400%. Consider nicotine patches or medications.")
    
    # High physical activity importance
    if data.physical_activity == "Sedentary" and heart_score > 50:
        actions.append("🏃 INCREASE DAILY ACTIVITY — Start with 30 minutes of walking daily. This alone can reduce your heart disease risk by 20%.")
    
    # Sleep improvement
    if data.sleep_hours in ["<5", "5-6"] and diabetes_score > 50:
        actions.append("😴 IMPROVE SLEEP QUALITY — Aim for 7-8 hours nightly. Poor sleep directly increases insulin resistance and diabetes risk by 30%.")
    
    # Sugar reduction
    if data.sugar_intake == "High" and diabetes_score > 55:
        actions.append("🍬 ELIMINATE ADDED SUGARS — Reduce sugary drinks and desserts immediately. This change directly controls blood glucose levels.")
    
    # Weight management
    if obesity_score > 60:
        actions.append("⚖️ WEIGHT MANAGEMENT PLAN — Losing just 5-10% of your body weight significantly reduces all three risk categories. Consult a nutritionist.")
    
    # Stress management
    if data.stress_level == "High" and heart_score > 60:
        actions.append("🧘 MANAGE STRESS — Practice meditation, yoga, or deep breathing for 10 minutes daily. High stress is a major heart risk factor.")
    
    # Fried food reduction
    if data.fried_food == "Frequently" and (heart_score > 55 or obesity_score > 55):
        actions.append("🍟 REDUCE FRIED FOODS — Replace fried items with grilled or baked alternatives. Oils oxidize under heat, increasing inflammation.")
    
    # Water intake improvement
    if data.water_intake == "<1L" and diabetes_score > 50:
        actions.append("💧 INCREASE WATER INTAKE — Drink at least 2L daily. Better hydration improves glucose metabolism and reduces diabetes risk.")
    
    # Screen time reduction
    if data.screen_time == ">4hrs" and obesity_score > 50:
        actions.append("📱 REDUCE SCREEN TIME — Excessive sitting worsens obesity risk. Take breaks every hour, move around.")
    
    # Family history counseling
    if data.family_history_heart and heart_score > 55:
        actions.append("👨‍⚕️ CONSULT CARDIOLOGIST — With family history of heart disease and elevated risk score, get a professional cardiac assessment.")
    
    if data.family_history_diabetes and diabetes_score > 60:
        actions.append("👨‍⚕️ SCHEDULE ENDOCRINOLOGIST VISIT — Family history + high diabetes risk requires professional glucose monitoring and insulin evaluation.")
    
    # If still need more actions, add generic ones
    while len(actions) < 3:
        if "diet" not in " ".join(actions).lower():
            actions.append("🥗 ADOPT MEDITERRANEAN DIET — Emphasize vegetables, whole grains, olive oil, and lean proteins to reduce all risk factors.")
        elif "exercise" not in " ".join(actions).lower():
            actions.append("💪 STRENGTH TRAINING 2x/WEEK — Building muscle improves metabolism and insulin sensitivity.")
        else:
            actions.append("📋 GET ANNUAL CHECK-UPS — Regular blood tests help catch metabolic changes early.")
    
    # Return top 3 actions
    return actions[:3]


# ─────────────────────────────
# SECTION F: Master Predict Function
# ─────────────────────────────

def run_prediction(data: VitalScanInput) -> RiskOutput:
    """
    Complete ML pipeline: feature prep → prediction → risk adjustment → output.
    Handles missing models gracefully with fallback calculations.
    """
    
    # Prepare features
    heart_features = prepare_heart_features(data)
    diabetes_features = prepare_diabetes_features(data)
    
    # 1. Heart Disease Risk Score
    if MODELS["heart"] is not None:
        try:
            # Model returns probability for positive class
            heart_prob = MODELS["heart"].predict_proba(heart_features)[0][1]
            heart_score = heart_prob * 100
            logger.info(f"Heart prediction successful: {heart_score:.1f}")
        except Exception as e:
            logger.warning(f"Heart prediction failed, using fallback: {e}")
            # Fallback: weighted calculation
            heart_score = (
                (int(data.smoking_status != "Never") * 25) +
                (data.age / 80 * 20) +
                (10 if data.family_history_heart else 0) +
                (5 if data.stress_level == "High" else 0) +
                (5 if data.chest_discomfort != "Never" else 0)
            )
    else:
        # Fallback prediction without model
        heart_score = (
            (int(data.smoking_status != "Never") * 25) +
            (data.age / 80 * 20) +
            (10 if data.family_history_heart else 0) +
            (5 if data.stress_level == "High" else 0) +
            (5 if data.chest_discomfort != "Never" else 0)
        )
    
    # 2. Diabetes Risk Score
    if MODELS["diabetes"] is not None:
        try:
            diabetes_prob = MODELS["diabetes"].predict_proba(diabetes_features)[0][1]
            diabetes_score = diabetes_prob * 100
            logger.info(f"Diabetes prediction successful: {diabetes_score:.1f}")
        except Exception as e:
            logger.warning(f"Diabetes prediction failed, using fallback: {e}")
            # Fallback: weighted calculation
            bmi = data.weight_kg / ((data.height_cm / 100) ** 2)
            diabetes_score = (
                (bmi / 40 * 35) +  # BMI component
                (int(data.family_history_diabetes) * 20) +
                (data.age / 80 * 15) +
                (10 if data.sugar_intake == "High" else 0) +
                (5 if data.thirst_fatigue != "Never" else 0)
            )
    else:
        # Fallback prediction without model
        bmi = data.weight_kg / ((data.height_cm / 100) ** 2)
        diabetes_score = (
            (bmi / 40 * 35) +
            (int(data.family_history_diabetes) * 20) +
            (data.age / 80 * 15) +
            (10 if data.sugar_intake == "High" else 0) +
            (5 if data.thirst_fatigue != "Never" else 0)
        )
    
    # 3. Obesity Risk Score
    obesity_result = calculate_obesity_risk(data)
    obesity_score = obesity_result["score"]
    obesity_category = obesity_result["category"]
    
    # Clamp scores to 0-100
    heart_score = max(0, min(100, heart_score))
    diabetes_score = max(0, min(100, diabetes_score))
    obesity_score = max(0, min(100, obesity_score))
    
    # 4. Apply compounding logic
    compounding_result = calculate_compounding(heart_score, diabetes_score, obesity_score)
    heart_score = compounding_result["heart_score"]
    compounding_alert = compounding_result["compounding_alert"]
    compounding_message = compounding_result["compounding_message"]
    
    # 5. Assign risk labels
    def get_risk_label(score: float) -> str:
        if score < 35:
            return "Low"
        elif score < 65:
            return "Moderate"
        else:
            return "High"
    
    # 6. Generate action plan
    action_plan = generate_action_plan(data, heart_score, diabetes_score, obesity_score)
    
    # 7. Return complete output
    return RiskOutput(
        heart_risk_score=round(heart_score, 1),
        heart_risk_label=get_risk_label(heart_score),
        diabetes_risk_score=round(diabetes_score, 1),
        diabetes_risk_label=get_risk_label(diabetes_score),
        obesity_risk_score=round(obesity_score, 1),
        obesity_risk_label=get_risk_label(obesity_score),
        obesity_category=obesity_category,
        compounding_alert=compounding_alert,
        compounding_message=compounding_message,
        action_plan=action_plan
    )
