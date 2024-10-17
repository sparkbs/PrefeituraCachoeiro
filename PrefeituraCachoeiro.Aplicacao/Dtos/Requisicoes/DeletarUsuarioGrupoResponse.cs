using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class DeletarUsuarioGrupoResponse
    {
        public string Mensagem { get; set; }

        public DeletarUsuarioGrupoResponse(): this(string.Empty)
        {

        }

        public DeletarUsuarioGrupoResponse(string mensagem)
        {
            Mensagem = mensagem;
        }
    }
}