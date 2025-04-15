using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class MedicaoEnviadaNaoPodeSerExcluidaError : Error
    {
        public MedicaoEnviadaNaoPodeSerExcluidaError(string message)
        {
            Message = message ?? "Um medição enviada não pode ser excluída";
        }
    }
}
