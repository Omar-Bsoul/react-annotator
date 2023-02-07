export const useConfiguration = () => {
  const scaleFactor = 1;

  return {
    debounceDuration: 500,
    minimumVertexHighlightDistance: 25 * scaleFactor,
    minimumLineHighlightedDistance: 15 * scaleFactor,
    minimumShapeArea: 192,
    highlightedLineBackgroundColor: '#FFFFFF77',
    highlightedLineBackgroundWidth: 6 * scaleFactor,
    highlightedLineForegroundColor: '#000000',
    highlightedLineForegroundWidth: 2 * scaleFactor,
    highlightedLineInsertVertexCircleBackgroundColor: '#FFFFFF',
    highlightedLineInsertVertexCircleBorderWidth: 5 * scaleFactor,
    highlightedLineInsertVertexCircleForegroundColor: '#40c220',
    highlightedLineInsertVertexCircleRadius: 5 * scaleFactor,
    highlightedPointBackgroundColor: '#FFFFFF77',
    highlightedPointBackgroundRadius: 3 * scaleFactor,
    highlightedPointBackgroundWidth: 6 * scaleFactor,
    highlightedPointForegroundColor: '#000000',
    highlightedPointForegroundRadius: 3 * scaleFactor,
    snackbarErrorDuration: 2000,
    minimumCreateVertexDistance: 10 * scaleFactor,
    minimumDisplaceVertexDistance: 5 * scaleFactor,
  };
};
