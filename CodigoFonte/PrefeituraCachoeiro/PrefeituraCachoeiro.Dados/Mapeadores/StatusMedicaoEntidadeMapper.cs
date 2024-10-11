using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class StatusMedicaoEntidadeMapper : IEntityTypeConfiguration<StatusMedicaoEntidade>
    {
        public void Configure(EntityTypeBuilder<StatusMedicaoEntidade> builder)
        {
            builder.ToTable("tb_status_medicao").HasKey(i => i.IdStatusMedicao);
            builder.Property(x => x.IdStatusMedicao).HasColumnName("idstatusmedicao").IsRequired();
            builder.Property(x => x.Nome).HasColumnName("nome").IsRequired().HasColumnType("varchar(100)");
            builder.Property(x => x.DataCriacao).HasColumnName("datacriacao").IsRequired();
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");
        }
    }
}