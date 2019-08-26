namespace Breadstone.LogicCircuit.Model.Complex
{
    public class Pin
    {
        public string Id { get; set; }
        public Position Position { get; set; } = new Position(0, 0);
        public ShellPosition ShellPosition { get; set; } = ShellPosition.LEFT_TOP;
    }
}