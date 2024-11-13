using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ItemsContratoEntidadeMapper : IEntityTypeConfiguration<ItemsContratoEntidade>
    {
        public void Configure(EntityTypeBuilder<ItemsContratoEntidade> builder)
        {
            builder.ToTable("tb_items_contrato").HasKey(i => i.IdItemContrato);
            builder.Property(x => x.IdItemContrato).HasColumnName("iditemcontrato").IsRequired();
            builder.Property(x => x.ContratosId).HasColumnName("IdContrato").IsRequired();
            builder.Property(x => x.ItemId).HasColumnName("ItemIdItem").IsRequired();
            builder.Property(x => x.QuantidadeId).HasColumnName("QuantidadeIdQuantidade").IsRequired();
            builder.Property(x => x.Unidade).HasColumnName("unidade").IsRequired();
            builder.Property(x => x.ValorSemBdi).HasColumnName("valorsembdi").IsRequired();
            builder.Property(x => x.ValorComBdi).HasColumnName("valorcombdi").IsRequired();
            builder.Property(x => x.ValorTotalComBdi).HasColumnName("valortotalcombdi").IsRequired();
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");

            builder.HasOne(x => x.Item)
                   .WithMany(x => x.ItemsContrato)
                   .HasForeignKey(x => x.ItemId)
                   .HasConstraintName("fk_items_contrato_item");

            builder.HasOne(x => x.Contrato)
                   .WithMany(x => x.Items)
                   .HasForeignKey(x => x.ContratosId)
                   .HasConstraintName("fk_items_contratos_contrato");

            builder.HasOne(x => x.Quantidade)
                   .WithMany(x => x.ItemsContrato)
                   .HasForeignKey(x => x.QuantidadeId)
                   .HasConstraintName("fk_items_items_quantidade");

            builder.HasMany(x => x.ItemsMedicoesProjeto)
                   .WithOne(x => x.ItemsContrato)
                   .HasForeignKey(x => x.IdItemContrato)
                   .HasConstraintName("fk_items_contrato_items_medicoesprojeto");
        }
    }
}