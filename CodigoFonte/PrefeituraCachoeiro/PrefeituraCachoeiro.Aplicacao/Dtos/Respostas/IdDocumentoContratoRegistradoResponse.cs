namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class IdDocumentoContratoRegistradoResponse
    {
        public int Id { get; set; }
        public string ArquivoMedicao { get; set; }
        public string Arquivo { get; set; }

        public IdDocumentoContratoRegistradoResponse()
        {

        }

        public IdDocumentoContratoRegistradoResponse(int id, string arquivoMedicao)
        {
            Id = id;
            ArquivoMedicao = arquivoMedicao;
        }
    }
}