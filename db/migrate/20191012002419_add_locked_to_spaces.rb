class AddLockedToSpaces < ActiveRecord::Migration[6.0]
  def change
    add_column :spaces, :locked, :boolean
  end
end
