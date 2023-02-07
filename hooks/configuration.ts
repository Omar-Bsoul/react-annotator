export const useConfiguration = () => {
  const farHighlightElemenetsScaleFactor = 0.5;
  const closeHighlightElemenetsScaleFactor = 1; // not implemented
  const performActionScaleFactor = 0.5;

  return {
    debounceDuration: 500,
    minimumVertexHighlightDistance: 25 * farHighlightElemenetsScaleFactor,
    minimumLineHighlightedDistance: 15 * farHighlightElemenetsScaleFactor,
    minimumShapeArea: 192,
    highlightedLineBackgroundColor: '#FFFFFF77',
    highlightedLineBackgroundWidth: 6 * farHighlightElemenetsScaleFactor,
    highlightedLineForegroundColor: '#000000',
    highlightedLineForegroundWidth: 2 * farHighlightElemenetsScaleFactor,
    highlightedLineInsertVertexCircleBackgroundColor: '#FFFFFF',
    highlightedLineInsertVertexCircleBorderWidth: 5 * farHighlightElemenetsScaleFactor,
    highlightedLineInsertVertexCircleForegroundColor: '#40c220',
    highlightedLineInsertVertexCircleRadius: 5 * farHighlightElemenetsScaleFactor,
    highlightedPointBackgroundColor: '#FFFFFF77',
    highlightedPointBackgroundRadius: 3 * farHighlightElemenetsScaleFactor,
    highlightedPointBackgroundWidth: 6 * farHighlightElemenetsScaleFactor,
    highlightedPointForegroundColor: '#000000',
    highlightedPointForegroundRadius: 3 * farHighlightElemenetsScaleFactor,
    snackbarErrorDuration: 2000,
    minimumCreateVertexDistance: 10 * performActionScaleFactor,
    minimumDisplaceVertexDistance: 5 * performActionScaleFactor,
    classifierColor: '#6022FF44',
    classifierBorderColor: '#000000',
    classifierBorderWidth: 1,
  };
};
