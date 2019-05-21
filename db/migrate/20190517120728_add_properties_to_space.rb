class AddPropertiesToSpace < ActiveRecord::Migration[6.0]
  def change

    add_column :spaces, :published, :boolean, default: false

    add_column :spaces, :latitude, :float
    add_column :spaces, :longitude, :float
    add_column :spaces, :radius, :float

    create_table :user_spaces do |t|
      t.string :email
      t.integer :user_id
      t.integer :space_id
      t.datetime :craeted_at
    end
  end
end
