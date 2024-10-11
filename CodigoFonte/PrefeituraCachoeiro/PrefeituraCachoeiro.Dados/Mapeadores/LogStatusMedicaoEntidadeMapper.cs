using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class LogStatusMedicaoEntidadeMapper : IEntityTypeConfiguration<LogStatusMedicaoEntidade>
    {
        public void Configure(EntityTypeBuilder<LogStatusMedicaoEntidade> builder)
        {
            builder.ToTable("tb_log_status_medicao").HasKey(i => i.IdLogStatusMedicao);
            builder.Property(x => x.IdLogStatusMedicao).HasColumnName("idlogstatusmedicao").IsRequired();
            builder.Property(x => x.IdUsuario).HasColumnName("idusuario").IsRequired();
            builder.Property(x => x.DataLog).HasColumnName("datalog").IsRequired();
            builder.Property(x => x.IdMedicoesProjeto).HasColumnName("idmedicoesprojeto").IsRequired();
            builder.Property(x => x.IdStatusMedicao).HasColumnName("idstatusmedicao");
            builder.Property(x => x.MotivoStatusMedicao).HasColumnName("motivostatusmedicao").IsRequired(false).HasColumnType("varchar(500)");
            builder.Property(x => x.DataDelecao).HasColumnName("datadelecao");
        }
    }
}