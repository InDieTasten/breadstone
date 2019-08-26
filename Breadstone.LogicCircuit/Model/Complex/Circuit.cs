using Breadstone.LogicCircuit.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Breadstone.LogicCircuit.Model.Complex
{
    public class Circuit
    {
        public string Id { get; set; }
        public List<Component> Components { get; set; } = new List<Component>();
        public List<Pin> Pins { get; set; } = new List<Pin>();
        public List<Wiring> Wiring { get; set; } = new List<Wiring>();
    }
}
