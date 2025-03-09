using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrefeituraCachoeiro.Dominio.Entidades;

namespace PrefeituraCachoeiro.Dados.Mapeadores
{
    public class TemplateMapper : IEntityTypeConfiguration<TemplateEntidade>
    {
        public void Configure(EntityTypeBuilder<TemplateEntidade> builder)
        {
            builder.ToTable("tb_template").HasKey(i => i.IdTemplate);
            builder.Property(x => x.IdTemplate).HasColumnName("idtemplate").IsRequired();
            builder.Property(x => x.Nome).HasColumnName("nome").IsRequired(true).HasColumnType("varchar(200)");

            builder.Property(x => x.IdTemplate)
                   .HasColumnName("idtemplate")
                   .ValueGeneratedOnAdd()
                   .IsRequired(true);
        }
    }
}