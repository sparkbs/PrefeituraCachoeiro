using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class MedicaoNaoPodeSerEnviadaClienteError : Error
    {
        public MedicaoNaoPodeSerEnviadaClienteError(string message)
        {
            Message = message ?? "A medição não pode ser enviada para o cliente";
        }
    }
}