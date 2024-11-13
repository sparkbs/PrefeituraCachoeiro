using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class ItemMedicoesProjetoEntidadeMapper : IEntityTypeConfiguration<ItemsMedicoesProjetoEntidade>
    {
        public void Configure(EntityTypeBuilder<ItemsMedicoesProjetoEntidade> builder)
        {
            builder.ToTable("tb_items_medicoes_projeto").HasKey(i => i.IdItemMedicoesProjeto);
            builder.Property(x => x.IdItemMedicoesProjeto).HasColumnName("iditemmedicoesprojeto").IsRequired();
            builder.Property(x => x.IdMedicoesProjeto).HasColumnName("idmedicoesprojeto").IsRequired();
            builder.Property(x => x.IdItemContrato).HasColumnName("iditemcontrato").IsRequired();
            builder.Property(x => x.Unidade).HasColumnName("unidade").IsRequired();
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");

            builder.HasOne(x => x.MedicoesProjeto)
                   .WithMany(x => x.Items)
                   .HasForeignKey(x => x.IdMedicoesProjeto)
                   .HasConstraintName("fk_items_medicoesprojeto_medicoes_projeto");

            builder.HasOne(x => x.ItemsContrato)
                   .WithMany(x => x.ItemsMedicoesProjeto)
                   .HasForeignKey(x => x.IdItemContrato)
                   .HasConstraintName("fk_items_medicoesprojeto_item_contrato");
        }
    }
}