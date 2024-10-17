using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class GrupoPermissaoNaoEncontradoError : Error
    {
        public GrupoPermissaoNaoEncontradoError(string message)
        {
            Message = message ?? "O grupo informado não está associado a permissão informada";
        }
    }
}
