using System.Collections.Generic;

namespace Breadstone.LogicCircuit.Model
{
    public class Circuit
    {
        public string Id { get; set; }
        public List<Component> Components { get; set; }
        public List<Pin> Pins { get; set; }
        public List<Wiring> Wiring { get; set; }


        public void AddComponent(Component component)
        {
            Components.Add(component);
        }
    }
}
