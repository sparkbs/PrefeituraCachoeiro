namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ProjetoEntidade: EntidadeBase
    {
        public int IdProjeto { get; set; }
        public string? NomeProjeto { get; set; }
        public int? CodigoProjeto { get; set; }
        public List<ContratosProjetosEntidade> Contratos { get; set; }
        public List<MedicoesProjetoEntidade> MedicoesProjeto { get; set; }

        public ProjetoEntidade(): base()
        {

        }

        public ProjetoEntidade(string nomeProjeto): this()
        {
            this.NomeProjeto = nomeProjeto;
        }
    }
}