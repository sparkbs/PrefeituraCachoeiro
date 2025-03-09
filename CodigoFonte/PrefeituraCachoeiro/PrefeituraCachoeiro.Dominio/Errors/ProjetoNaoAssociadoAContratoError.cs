using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class ProjetoNaoAssociadoAContratoError : Error
    {
        public ProjetoNaoAssociadoAContratoError(string message)
        {
            Message = message ?? "O projeto informado não está associado ao contrato informado.Você deve primeiro associar o projeto ao contrato";
        }
    }
}