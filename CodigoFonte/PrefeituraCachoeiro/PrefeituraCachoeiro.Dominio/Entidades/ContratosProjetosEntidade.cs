namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ContratosProjetosEntidade
    {
        public int IdContratoProjeto { get; set; }
        public int IdContrato { get; set; }
        public ContratosEntidade Contratos { get; set; }
        public int IdProjeto { get; set; }
        public ProjetoEntidade Projetos { get; set; }

        public ContratosProjetosEntidade() : base()
        {
            
        }
    }
}