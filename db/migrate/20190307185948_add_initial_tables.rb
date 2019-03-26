class AddInitialTables < ActiveRecord::Migration[6.0]
  def change

    create_table :users do |t|
      ## Database authenticatable
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at
      t.timestamps null: false
    end

    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true

    create_table :spaces do |t|
      t.integer :user_id
      t.string :name
      t.datetime :created_at
    end

    create_table :pieces do |t|
      t.integer :user_id
      t.integer :space_id
      t.string :name
      t.boolean :published
      t.integer :marker_units
      t.float :marker_width
      # attachment for marker
      t.text :code
      t.jsonb :callbacks     
    end
  end
end
