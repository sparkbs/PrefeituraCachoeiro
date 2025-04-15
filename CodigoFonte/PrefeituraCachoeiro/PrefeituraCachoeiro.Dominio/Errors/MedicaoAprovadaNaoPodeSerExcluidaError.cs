using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class MedicaoAprovadaNaoPodeSerExcluidaError : Error
    {
        public MedicaoAprovadaNaoPodeSerExcluidaError(string message)
        {
            Message = message ?? "Um medição aprovada não pode ser excluída";
        }
    }
}
