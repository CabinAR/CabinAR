Rails.application.routes.draw do
  get 'app/show'
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  mount ActionCable.server => '/cable'

  namespace :api do

    resource :logins, only: [ :show, :create ]
    resources :spaces do
      resources :pieces, shallow: true
    end
  end

  get "/app", to: "app#show"
end
