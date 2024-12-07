using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ContratosProjetosMapper : IEntityTypeConfiguration<ContratosProjetosEntidade>
    {
        public void Configure(EntityTypeBuilder<ContratosProjetosEntidade> builder)
        {
            builder.ToTable("tb_contrato_projetos").HasKey(i => i.IdContratoProjeto);
            builder.Property(x => x.IdContratoProjeto).HasColumnName("IdContratoProjeto").IsRequired();
            builder.Property(x => x.IdContrato).HasColumnName("IdContrato").IsRequired();
            builder.Property(x => x.IdProjeto).HasColumnName("IdProjeto").IsRequired();
        }
    }
}