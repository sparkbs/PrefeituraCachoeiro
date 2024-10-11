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
            builder.Property(x => x.IdContrato).HasColumnName("idcontrato").IsRequired();
            builder.Property(x => x.ItemIdItem).HasColumnName("ItemIdItem").IsRequired();
            builder.Property(x => x.QuantidadeIdQuantidade).HasColumnName("QuantidadeIdQuantidade").IsRequired();
            builder.Property(x => x.Unidade).HasColumnName("unidade").IsRequired();
            builder.Property(x => x.ValorSemBdi).HasColumnName("valorsembdi").IsRequired();
            builder.Property(x => x.ValorComBdi).HasColumnName("valorcombdi").IsRequired();
            builder.Property(x => x.ValorTotalComBdi).HasColumnName("valortotalcombdi").IsRequired();
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");
        }
    }
}