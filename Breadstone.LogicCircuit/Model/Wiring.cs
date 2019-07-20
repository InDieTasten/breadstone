using System.Collections.Generic;

namespace Breadstone.LogicCircuit.Model
{
    public class Wiring
    {
        public List<string> CircuitPins { get; set; }
        public List<ComponentPin> ComponentPins { get; set; }
        public int InitialPowerLevel { get; set; }
    }
}