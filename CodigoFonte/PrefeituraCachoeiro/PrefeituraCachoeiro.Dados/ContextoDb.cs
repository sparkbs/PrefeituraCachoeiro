using Microsoft.EntityFrameworkCore;
using PrefeituraCachoeiro.Dominio.Entidades;
using System.Reflection;

namespace PrefeituraCachoeiro.Dados
{
    public class ContextoDb: DbContext
    {
        public DbSet<ContratosEntidade> ContratosEntidade { get; set; }
        public DbSet<GruposEntidade> GruposEntidade { get; set; }
        public DbSet<ItemEntidade> ItemEntidade { get; set; }
        public DbSet<ItemsContratoEntidade> ItemsContratoEntidade { get; set; }
        public DbSet<ItemsMedicoesProjetoEntidade> ItemsMedicoesProjetoEntidade { get; set; }
        public DbSet<LogStatusMedicaoEntidade> LogStatusMedicaoEntidade { get; set; }
        public DbSet<MedicoesProjetoEntidade> MedicoesProjetoEntidade { get; set; }
        public DbSet<OrigemEntidade> OrigemEntidade { get; set; }
        public DbSet<PermissoesEntidade> PermissoesEntidade { get; set; }
        public DbSet<ProjetoEntidade> ProjetoEntidade { get; set; }
        public DbSet<QuantidadeEntidade> QuantidadeEntidade { get; set; }
        public DbSet<StatusMedicaoEntidade> StatusMedicaoEntidade { get; set; }
        public DbSet<TipoPermissoesEntidade> TipoPermissoesEntidade { get; set; }
        public DbSet<UsuariosEntidade> UsuariosEntidade { get; set; }
        public DbSet<UsuariosGruposEntidade> UsuariosGruposEntidade { get; set; }
        public DbSet<PrefeituraEntidade> PrefeituraEntidade { get; set; }
        public DbSet<EmpresaEntidade> EmpresaEntidade { get; set; }
        public DbSet<DbSequenceResult> DbSequenceResult { get; set; }
        public DbSet<ParametrosSistemaEntidade> ParametrosSistema { get; set; }
        public DbSet<ArquivosMedicoesProjetoEntidade> ArquivosMedicoesProjeto { get; set; }
        public DbSet<ContratosProjetosEntidade> ContratosProjetos { get; set; }

        public ContextoDb(DbContextOptions<ContextoDb> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            modelBuilder.Entity<DbSequenceResult>().HasNoKey();
        }
    }
}