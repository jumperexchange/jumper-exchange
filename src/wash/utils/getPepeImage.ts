/************************************************************************************************
 * getPepeImage Function
 *
 * This function returns the appropriate image filename based on the progress and color provided.
 * It uses a switch statement to determine the correct image stage based on the progress value.
 *
 * @param progress - The progress value (default is 0).
 * @param color - The color string (optional).
 * @returns The image filename corresponding to the progress and color.
 *************************************************************************************************/
export function getPepeImage(progress: number = 0, color?: string): string {
  switch (true) {
    case progress >= 0 && progress < 20:
      return `${color}-stage-1.png`;
    case progress >= 20 && progress < 40:
      return `${color}-stage-2.png`;
    case progress >= 40 && progress < 60:
      return `${color}-stage-3.png`;
    case progress >= 60 && progress < 80:
      return `${color}-stage-4.png`;
    default:
      return `${color}-stage-5.png`;
  }
}
