using System.Collections.Generic;

namespace Breadstone.LogicCircuit.Model
{
    public class RootCircuit : Circuit
    {
        private List<Circuit> _subCircuits = new List<Circuit>();
        public IReadOnlyList<Circuit> SubCircuits => _subCircuits.AsReadOnly();

        public void AddSubCircuit(Circuit circuit)
        {
            _subCircuits.Add(circuit);
        }
    }
}
