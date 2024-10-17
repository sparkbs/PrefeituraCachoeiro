using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ContratosEntidadeMapper : IEntityTypeConfiguration<ContratosEntidade>
    {
        public void Configure(EntityTypeBuilder<ContratosEntidade> builder)
        {
            builder.ToTable("tb_contratos").HasKey(i=> i.IdContrato);
            builder.Property(x => x.IdContrato).HasColumnName("idcontrato").IsRequired();
            builder.Property(x => x.IdProjeto).HasColumnName("idprojeto").IsRequired();
            builder.Property(x => x.DataContrato).HasColumnName("datacontrato").IsRequired();
            builder.Property(x => x.NumeroContrato).HasColumnName("numerocontrato").IsRequired().HasColumnType("varchar(50)");
            builder.Property(x => x.ValorTotalPrevisto).HasColumnName("valortotalprevisto");
            builder.Property(x => x.ValorTotalSolicitado).HasColumnName("valortotalsolicitado");
            builder.Property(x => x.ValorTotalMedido).HasColumnName("valortotalmedido");
            builder.Property(x => x.ValorSaldoRestante).HasColumnName("valorsaldorestante");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");

            builder.HasOne(x => x.Projeto)
                   .WithMany(x => x.Contratos)
                   .HasForeignKey(x => x.IdProjeto)
                   .HasConstraintName("fk_contratos_projetos");

            builder.HasMany(x => x.Items)
                   .WithOne(x => x.Contrato)
                   .HasForeignKey(x => x.ContratosId)
                   .HasConstraintName("fk_contratos_items");

            builder.HasMany(x => x.MedicoesProjeto)
                   .WithOne(x => x.Contratos)
                   .HasForeignKey(x => x.IdContrato)
                   .HasConstraintName("fk_contratos_medicoesprojeto");
        }
    }
}