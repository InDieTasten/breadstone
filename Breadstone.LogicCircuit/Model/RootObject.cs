namespace Breadstone.LogicCircuit.Model
{
    public class RootObject
    {
        public string Version => "0.1.0";
        public RootCircuit Circuit { get; set; } = new RootCircuit();
    }
}
