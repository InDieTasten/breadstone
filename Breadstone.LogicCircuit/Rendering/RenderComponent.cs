using Breadstone.LogicCircuit.Model.Complex;
using System.Collections.Generic;
using System.Linq;

namespace Breadstone.LogicCircuit.Rendering
{
    public class RenderComponent
    {
        public string Type { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }

        public List<RenderPin> Pins { get; set; }

        public static RenderComponent FromCircuit(Circuit circuit)
        {
            var topEdgeMinLength = CalculateMinEdgeLength(circuit.Pins.Where(pin =>
                            pin.ShellPosition == ShellPosition.TOP_LEFT
                            || pin.ShellPosition == ShellPosition.TOP_CENTER
                            || pin.ShellPosition == ShellPosition.TOP_RIGHT));
            var bottomEdgeMinLength = CalculateMinEdgeLength(circuit.Pins.Where(pin =>
                            pin.ShellPosition == ShellPosition.BOTTOM_LEFT
                            || pin.ShellPosition == ShellPosition.BOTTOM_CENTER
                            || pin.ShellPosition == ShellPosition.BOTTOM_RIGHT));
            var componentWidth = (new int[] { RenderOptions.MinComponentWidth, topEdgeMinLength, bottomEdgeMinLength }).Max();

            var leftEdgeMinLength = CalculateMinEdgeLength(circuit.Pins.Where(pin =>
                            pin.ShellPosition == ShellPosition.LEFT_TOP
                            || pin.ShellPosition == ShellPosition.LEFT_CENTER
                            || pin.ShellPosition == ShellPosition.LEFT_BOTTOM));
            var rightEdgeMinLength = CalculateMinEdgeLength(circuit.Pins.Where(pin =>
                            pin.ShellPosition == ShellPosition.RIGHT_TOP
                            || pin.ShellPosition == ShellPosition.RIGHT_CENTER
                            || pin.ShellPosition == ShellPosition.RIGHT_BOTTOM));
            var componentHeight = (new int[] { RenderOptions.MinComponentHeight, leftEdgeMinLength, rightEdgeMinLength }).Max();

            return new RenderComponent
            {
                Type = circuit.Id,
                Width = componentWidth * RenderOptions.GridSnappingDistance,
                Height = componentHeight * RenderOptions.GridSnappingDistance,
                Pins = CalculatePinPositions(circuit.Pins, componentWidth, componentHeight)
            };
        }

        private static List<RenderPin> CalculatePinPositions(List<Pin> pins, int componentWidth, int componentHeight)
        {
            var renderPins = new List<RenderPin>();

            // TOP_LEFT
            IEnumerable<RenderPin> topLeftRenderPins = pins.Where(pin => pin.ShellPosition == ShellPosition.TOP_LEFT).OrderBy(pin => pin.Position.X).Select((pin, index) => new RenderPin()
            {
                Id = pin.Id,
                Position = new Position(RenderOptions.PinCornerDistance + (index * RenderOptions.PinDistance), 0)
            });
            renderPins.AddRange(topLeftRenderPins);

            // TOP_RIGHT
            IEnumerable<RenderPin> topRightRenderPins = pins.Where(pin => pin.ShellPosition == ShellPosition.TOP_RIGHT).OrderBy(pin => pin.Position.X).Select((pin, index) => new RenderPin()
            {
                Id = pin.Id,
                Position = new Position(componentWidth - RenderOptions.PinCornerDistance - (index * RenderOptions.PinDistance), 0)
            });
            renderPins.AddRange(topRightRenderPins);

            // TOP_CENTER
            var minX = (topLeftRenderPins.Count() * RenderOptions.PinDistance) + RenderOptions.PinCornerDistance + RenderOptions.PinGroupDistance;
            var maxX = (topRightRenderPins.Count() * RenderOptions.PinDistance) + RenderOptions.PinCornerDistance + RenderOptions.PinGroupDistance;
            var availableSpace = maxX - minX;
            var unnecessarySpace = (pins.Where(pin => pin.ShellPosition == ShellPosition.TOP_CENTER).Count() * RenderOptions.PinDistance) - availableSpace;
            IEnumerable<RenderPin> topCenterPins = pins.Where(pin => pin.ShellPosition == ShellPosition.TOP_CENTER).OrderBy(pin => pin.Position.X).Select((pin, index) => new RenderPin()
            {
                Id = pin.Id,
                Position = new Position(minX + (unnecessarySpace / 2) + (index * RenderOptions.PinDistance), 0)
            });
            renderPins.AddRange(topCenterPins);

            // TODO remaining pins

            return renderPins;
        }

        private static int CalculateMinEdgeLength(IEnumerable<Pin> edgePins)
        {
            IEnumerable<IGrouping<ShellPosition, Pin>> edgePinGroups = edgePins.GroupBy(pin => pin.ShellPosition);

            return (edgePins.Count() * RenderOptions.PinDistance)
                + ((edgePinGroups.Count() - 1) * RenderOptions.PinGroupDistance)
                + (2 * RenderOptions.PinCornerDistance);
        }
    }
}
