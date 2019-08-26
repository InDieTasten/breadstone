using Breadstone.LogicCircuit.Model.Complex;
using System.Collections.Generic;

namespace Breadstone.LogicCircuit
{
    class InbuiltCircuits
    {
        public readonly Circuit NOT = new Circuit
        {
            Id = "$NOT",
            Pins = new List<Pin>
            {
                new Pin
                {
                    Id = "i0",
                    ShellPosition = ShellPosition.LEFT_CENTER
                },
                new Pin
                {
                    Id = "q0",
                    ShellPosition = ShellPosition.RIGHT_CENTER
                }
            }
        };
    }
}
