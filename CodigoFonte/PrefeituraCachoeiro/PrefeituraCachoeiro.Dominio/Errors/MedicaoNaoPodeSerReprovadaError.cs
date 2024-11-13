using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class MedicaoNaoPodeSerReprovadaError : Error
    {
        public MedicaoNaoPodeSerReprovadaError(string message)
        {
            Message = message ?? "A medição não pode ser reprovada";
        }
    }
}