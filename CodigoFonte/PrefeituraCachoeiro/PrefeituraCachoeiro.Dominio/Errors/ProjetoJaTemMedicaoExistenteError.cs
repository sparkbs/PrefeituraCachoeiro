using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class ProjetoJaTemMedicaoExistenteError : Error
    {
        public ProjetoJaTemMedicaoExistenteError(string message)
        {
            Message = message ?? "Projeto já tem medição existente";
        }
    }
}