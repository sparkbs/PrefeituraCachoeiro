using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ProjetoEntidadeMapper : IEntityTypeConfiguration<ProjetoEntidade>
    {
        public void Configure(EntityTypeBuilder<ProjetoEntidade> builder)
        {
            builder.ToTable("tb_projetos").HasKey(i => i.IdProjeto);
            builder.Property(x => x.IdProjeto).HasColumnName("idprojeto").IsRequired();
            builder.Property(x => x.NomeProjeto).HasColumnName("nomeprojeto").IsRequired().HasColumnType("varchar(500)");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");

            builder.HasMany(x => x.Contratos)
                   .WithOne(x => x.Projeto)
                   .HasForeignKey(x => x.IdProjeto)
                   .HasConstraintName("fk_projeto_contratos");
        }
    }
}