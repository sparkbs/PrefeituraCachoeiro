using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class UsuarioGrupoJaExistenteError : Error
    {
        public UsuarioGrupoJaExistenteError(string message)
        {
            Message = message ?? "O usuário já está associado ao grupo informado";
        }
    }
}