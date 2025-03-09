using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ItemsAditivoEntidadeMapper : IEntityTypeConfiguration<ItemsAditivoEntidade>
    {
        public void Configure(EntityTypeBuilder<ItemsAditivoEntidade> builder)
        {
            builder.ToTable("tb_items_aditivo").HasKey(i => i.IdItemAditivo);
            builder.Property(x => x.IdItemAditivo).HasColumnName("iditemaditivo").IsRequired();
            builder.Property(x => x.AditivoId).HasColumnName("IdAditivo").IsRequired();
            builder.Property(x => x.ItemId).HasColumnName("ItemIdItem").IsRequired();
            builder.Property(x => x.QuantidadeId).HasColumnName("QuantidadeIdQuantidade").IsRequired();
            builder.Property(x => x.Unidade).HasColumnName("unidade").IsRequired();
            builder.Property(x => x.ValorSemBdi).HasColumnName("valorsembdi").IsRequired();
            builder.Property(x => x.ValorComBdi).HasColumnName("valorcombdi").IsRequired();
            builder.Property(x => x.ValorTotalComBdi).HasColumnName("valortotalcombdi").IsRequired();
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");

            builder.HasOne(x => x.Item)
                   .WithMany(x => x.ItemsAditivo)
                   .HasForeignKey(x => x.ItemId)
                   .HasConstraintName("fk_items_aditivo_item");
        }
    }
}