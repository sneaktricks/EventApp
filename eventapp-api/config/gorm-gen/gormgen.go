package main

import (
	"example/eventapi/model"

	"gorm.io/gen"
)

func main() {
	g := gen.NewGenerator(gen.Config{
		OutPath:       "dal",
		Mode:          gen.WithDefaultQuery,
		FieldNullable: true,
	})

	g.ApplyBasic(model.Event{}, model.Participation{})

	g.Execute()
}
