using System.Collections.Generic;

namespace Breadstone.LogicCircuit.Model.Complex
{
    public class RootCircuit : Circuit
    {
        private readonly List<Circuit> _subCircuits = new List<Circuit>();
        public IReadOnlyList<Circuit> SubCircuits => _subCircuits.AsReadOnly();

        public void AddSubCircuit(Circuit circuit)
        {
            _subCircuits.Add(circuit);
        }
    }
}
