using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class MedicaoReprovadaNaoPodeSerExcluidaError : Error
    {
        public MedicaoReprovadaNaoPodeSerExcluidaError(string message)
        {
            Message = message ?? "Um medição reprovada não pode ser excluída";
        }
    }
}
