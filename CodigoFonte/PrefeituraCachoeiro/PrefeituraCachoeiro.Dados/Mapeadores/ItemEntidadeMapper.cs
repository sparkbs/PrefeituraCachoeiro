using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ItemEntidadeMapper : IEntityTypeConfiguration<ItemEntidade>
    {
        public void Configure(EntityTypeBuilder<ItemEntidade> builder)
        {
            builder.ToTable("tb_item").HasKey(i => i.IdItem);
            builder.Property(x => x.IdItem).HasColumnName("iditem").IsRequired();
            builder.Property(x => x.Identificador).HasColumnName("identificador").IsRequired().HasColumnType("varchar(50)");
            builder.Property(x => x.Codigo).HasColumnName("codigo").IsRequired().HasColumnType("varchar(50)");
            builder.Property(x => x.OrigemIdOrigem).HasColumnName("OrigemIdOrigem").IsRequired();
            builder.Property(x => x.Descricao).HasColumnName("descricao").IsRequired().HasColumnType("varchar(1000)");
            builder.Property(x => x.Unidade).HasColumnName("unidade");
            builder.Property(x => x.QuantidadeIdQuantidade).HasColumnName("QuantidadeIdQuantidade");
            builder.Property(x => x.ValorSemBdi).HasColumnName("valorsembdi");
            builder.Property(x => x.ValorComBdi).HasColumnName("valorcombdi");
            builder.Property(x => x.ValorTotalComBdi).HasColumnName("valortotalcombdi");
            builder.Property(x => x.IdItemPai).HasColumnName("idtempai");
            builder.Property(x => x.Ordem).HasColumnName("ordem").IsRequired();
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");
        }
    }
}
