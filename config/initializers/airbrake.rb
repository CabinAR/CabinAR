require 'airbrake-ruby'

Airbrake.configure do |c|
  c.project_id = 245555
  c.project_key = '71b4490583d3eef005110b61cb49bfee'
  c.performance_stats = false
end
