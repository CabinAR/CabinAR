class AddTaglineToSpaces < ActiveRecord::Migration[6.0]
  def change
    add_column :spaces, :tagline, :string
  end
end
