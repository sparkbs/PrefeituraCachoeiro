using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class UsuarioGrupoNaoEncontradoError : Error
    {
        public UsuarioGrupoNaoEncontradoError(string message)
        {
            Message = message ?? "O usuário informado não foi encontrado no grupo informado";
        }
    }
}