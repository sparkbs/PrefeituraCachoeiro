namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class DeletarPermissaoResponse
    {
        public string Mensagem { get; set; }
        
        public DeletarPermissaoResponse(): this(string.Empty)
        {

        }

        public DeletarPermissaoResponse(string mensagem)
        {
            this.Mensagem = mensagem;
        }
    }
}