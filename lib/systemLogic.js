/**
 * Core System Logic - Determines cover state from sensor values and control mode.
 */

export function isRainDetected(rainValue, rainThreshold = 700) {
  return Number(rainValue) > Number(rainThreshold);
}

export function getSystemState({
  rainValue,
  rainThreshold,
  mode,
  manualAction,
  sensorStatus,
  currentCover
}) {
  if (sensorStatus === "ERROR") {
    return {
      cover: currentCover || "retracted",
      status: "Sensor Error",
      description: "Rain sensor unavailable. Automatic control paused.",
      decision: "Decision: Sensor status is ERROR; automatic decisions are paused.",
    };
  }

  const rain = isRainDetected(rainValue, rainThreshold);

  if (mode === "MANUAL") {
    if (manualAction === "deploy") {
      return {
        cover: "deployed",
        status: "Manual Deploy",
        description: "Manual override active. Cover deployed by user.",
        decision: `Decision: MANUAL mode selected and action is deploy; sensor logic bypassed.`,
      };
    }
    if (manualAction === "retract") {
      return {
        cover: "retracted",
        status: "Manual Retract",
        description: "Manual override active. Cover retracted by user.",
        decision: `Decision: MANUAL mode selected and action is retract; sensor logic bypassed.`,
      };
    }
  }

  if (rain) {
    return {
      cover: "deployed",
      status: "Rain Deploy",
      description: "Rain value exceeded threshold. Cover deployed automatically.",
      decision: `Decision: Rain value (${rainValue}) exceeded threshold (${rainThreshold}).`,
    };
  }

  return {
    cover: "retracted",
    status: "NoRain Retract",
    description: "Rain value below threshold. Cover retracted automatically.",
    decision: `Decision: Rain value (${rainValue}) did not exceed threshold (${rainThreshold}).`,
  };
}

/**
 * Get weather label from rain value using correct ranges
 * SUNNY: 500–620, BREEZY: 621–660, CLOUDY: 661–699, RAINY: 700+
 */
export function getWeatherLabel(rainValue) {
  const val = Number(rainValue);
  if (val >= 700) return "RAINY";
  if (val >= 661) return "CLOUDY";
  if (val >= 621) return "BREEZY";
  return "SUNNY";
}

/**
 * Generate weather appearance based on rain state (for UI visual representation)
 */
export function getWeatherAppearance(rain, temperature) {
  if (rain) {
    return "rainy";
  }
  
  if (temperature > 28) {
    return "sunny";
  }
  
  return "cloudy";
}

/**
 * Determine if alert should be triggered
 */
export function shouldAlert(rain, previousRain) {
  // Trigger alert when rain is detected (transition from no rain to rain)
  return rain && !previousRain;
}
