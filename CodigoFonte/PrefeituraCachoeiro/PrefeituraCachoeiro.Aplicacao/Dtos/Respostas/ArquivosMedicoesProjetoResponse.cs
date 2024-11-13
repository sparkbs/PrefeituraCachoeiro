namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class ArquivosMedicoesProjetoResponse
    {
        public int Id { get; set; }
        public string ArquivoMedicao { get; set; }

        public ArquivosMedicoesProjetoResponse()
        {

        }

        public ArquivosMedicoesProjetoResponse(int id, string arquivoMedicao) : this()
        {
            this.Id = id;
            this.ArquivoMedicao = arquivoMedicao;
        }
    }
}