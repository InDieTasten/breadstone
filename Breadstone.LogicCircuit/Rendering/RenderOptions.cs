namespace Breadstone.LogicCircuit.Rendering
{
    public static class RenderOptions
    {
        public const int GridSnappingDistance = 10;

        // Distance between a corner of a component and a pin
        public const int PinCornerDistance = 1;

        // Distance between pins inside of the same shell position group
        public const int PinDistance = 1;

        // Distance between pins of different shell position groups
        public const int PinGroupDistance = 2;

        public const int MinComponentWidth = 3;
        public const int MinComponentHeight = 2;
    }
}
