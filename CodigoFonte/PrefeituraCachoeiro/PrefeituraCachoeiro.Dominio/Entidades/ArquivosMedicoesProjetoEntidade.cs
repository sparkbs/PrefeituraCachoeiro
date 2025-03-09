namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ArquivosMedicoesProjetoEntidade: EntidadeBase
    {
        public int Id { get; set; }
        public int IdMedicoesProjeto { get; set; }
        public MedicoesProjetoEntidade MedicoesProjeto { get; set; }
        public string ArquivoMedicao { get; set; }
        public int IdOrigemArquivo { get; set; }

        public ArquivosMedicoesProjetoEntidade()
        {
            this.Create();
        }

        public ArquivosMedicoesProjetoEntidade(int idMedicoesProjeto, string arquivoMedicao): this()
        {
            this.IdMedicoesProjeto = idMedicoesProjeto;
            this.ArquivoMedicao = arquivoMedicao;
        }
    }
}