namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ArquivosContratosEntidade : EntidadeBase
    {
        public int Id { get; set; }
        public int IdContratos { get; set; }
        public ContratosEntidade Contratos { get; set; }
        public string ArquivoContrato { get; set; }

        public ArquivosContratosEntidade()
        {
            this.Create();
        }

        public ArquivosContratosEntidade(int idContratos, string arquivoContrato) : this()
        {
            this.IdContratos = idContratos;
            this.ArquivoContrato = arquivoContrato;
        }
    }
}