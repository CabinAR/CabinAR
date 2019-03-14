Rails.application.routes.draw do
  get 'app/show'
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get "/app", to: "app#show"
end
